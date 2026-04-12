#!/usr/bin/env node
/**
 * Download completo de todos os assets do site via Playwright
 * Intercepta cada requisição de rede e salva localmente
 */
'use strict';

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const BASE_URL = 'https://peptideoshealth.com.br';
const OUT_DIR = path.join(__dirname, 'site', 'peptideoshealth.com.br');
const ASSETS_DIR = path.join(OUT_DIR, 'assets');

// Rotas para visitar
const ROUTES = [
    '/', '/library', '/finder', '/compare', '/protocols',
    '/learn', '/calculator', '/stacks', '/interactions',
    '/body-map', '/schedule', '/support', '/auth',
    '/learn?tab=guides', '/peptide/66',
];

const downloaded = new Set();

function saveFile(relativePath, content) {
    const filePath = path.join(OUT_DIR, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
}

async function downloadExternal(url) {
    if (downloaded.has(url)) return;
    downloaded.add(url);

    return new Promise((resolve) => {
        const parsed = new URL(url);
        const client = parsed.protocol === 'https:' ? https : http;
        const p = parsed.pathname;
        const ext = path.extname(p).slice(1);
        if (!ext || ['js', 'css', 'html'].includes(ext)) { resolve(); return; }

        const outPath = path.join(OUT_DIR, 'external', parsed.hostname, p);
        if (fs.existsSync(outPath)) { resolve(); return; }

        client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            if (res.statusCode !== 200) { resolve(); return; }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                try {
                    fs.mkdirSync(path.dirname(outPath), { recursive: true });
                    fs.writeFileSync(outPath, Buffer.concat(chunks));
                    console.log(`  ⬇ ${url.slice(0, 80)}`);
                } catch { }
                resolve();
            });
        }).on('error', () => resolve());
    });
}

async function main() {
    console.log('🚀 Iniciando download completo via Playwright');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.mkdirSync(ASSETS_DIR, { recursive: true });

    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    });
    const page = await context.newPage();

    // Interceptar TODAS as requisições
    const externalUrls = new Set();
    page.on('response', async (res) => {
        const url = res.url();
        const status = res.status();
        if (status < 200 || status >= 400) return;
        if (url.startsWith('data:')) return;
        if (url.includes('analytics') || url.includes('facebook') || url.includes('pixel')) return;

        try {
            const parsed = new URL(url);
            // Assets do próprio domínio
            if (parsed.hostname === 'peptideoshealth.com.br') {
                const body = await res.body();
                const rel = parsed.pathname;
                const filePath = path.join(OUT_DIR, rel);
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(path.dirname(filePath), { recursive: true });
                    fs.writeFileSync(filePath, body);
                }
            } else {
                // Assets externos (CDN, fonts, imagens)
                externalUrls.add(url);
            }
        } catch { }
    });

    // Visitar cada rota
    for (const route of ROUTES) {
        console.log(`\n📄 Visitando: ${BASE_URL}${route}`);
        try {
            await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(2000);
            // Scroll para carregar lazy images
            await page.evaluate(async () => {
                for (let i = 0; i < 10; i++) {
                    window.scrollBy(0, window.innerHeight);
                    await new Promise(r => setTimeout(r, 200));
                }
            });
            await page.waitForTimeout(1000);

            // Capturar HTML renderizado de cada rota
            const html = await page.content();
            const routeFile = route === '/' ? 'index.html' : route.replace(/^\//, '') + '.html';
            saveFile(routeFile, html);
            console.log(`  ✅ ${routeFile}`);
        } catch (e) {
            console.error(`  ❌ ${route}: ${e.message.slice(0, 60)}`);
        }
    }

    await browser.close();

    // Baixar assets externos
    console.log(`\n⬇ Baixando ${externalUrls.size} assets externos...`);
    const urls = [...externalUrls];
    for (let i = 0; i < urls.length; i += 5) {
        await Promise.all(urls.slice(i, i + 5).map(downloadExternal));
    }

    // Gerar mapa de assets externos para o nginx
    const assetMap = {};
    for (const url of externalUrls) {
        try {
            const parsed = new URL(url);
            const localPath = `/external/${parsed.hostname}${parsed.pathname}`;
            assetMap[url] = localPath;
        } catch { }
    }
    fs.writeFileSync(path.join(OUT_DIR, 'asset-map.json'), JSON.stringify(assetMap, null, 2));

    console.log('\n✅ Download completo!');
    console.log('Assets externos:', externalUrls.size);

    // Relatório final
    const allFiles = [];
    function listFiles(dir) {
        for (const f of fs.readdirSync(dir)) {
            const full = path.join(dir, f);
            if (fs.statSync(full).isDirectory()) listFiles(full);
            else allFiles.push(full.replace(OUT_DIR, ''));
        }
    }
    listFiles(OUT_DIR);
    console.log('Total de arquivos:', allFiles.length);
    const { execSync } = require('child_process');
    console.log('Tamanho total:', execSync(`du -sh ${OUT_DIR}`).toString().trim());
}

main().catch(console.error);
