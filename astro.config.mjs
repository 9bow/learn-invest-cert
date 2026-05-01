// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://9bow.github.io',
  base: '/learn-invest-cert',
  integrations: [
    starlight({
      head: [
        {
          tag: 'script',
          attrs: { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-P5PMGWJKNT' },
        },
        {
          tag: 'script',
          content: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-P5PMGWJKNT');`,
        },
      ],
      title: '투자자산운용사 완벽 가이드',
      defaultLocale: 'root',
      locales: {
        root: { label: '한국어', lang: 'ko' },
      },
      sidebar: [
        { label: '시험 안내 및 학습 전략', autogenerate: { directory: '01-exam-guide' } },
        { label: '직무윤리', autogenerate: { directory: '02-ethics' } },
        { label: '금융투자 관련 법규', autogenerate: { directory: '03-regulations' } },
        { label: '주식운용 전략', autogenerate: { directory: '04-equity' } },
        { label: '채권운용 전략', autogenerate: { directory: '05-bond' } },
        { label: '파생상품운용 전략', autogenerate: { directory: '06-derivatives' } },
        { label: '거시경제 및 분산투자', autogenerate: { directory: '07-macro-diversification' } },
        { label: '대안투자 및 해외증권투자', autogenerate: { directory: '08-alternative-overseas' } },
        { label: '투자분석 및 리스크관리', autogenerate: { directory: '09-analysis-risk' } },
        { label: '금융상품 및 세제', autogenerate: { directory: '10-products-tax' } },
        { label: '실전 모의고사 및 기출문제', autogenerate: { directory: '11-mock-exams' } },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/9bow/learn-invest-cert',
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    react(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
