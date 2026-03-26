This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Typography Source

This project is configured to use **Noto IKEA Latin** globally via a stylesheet served by your Skapa MCP server.

Set either the full stylesheet URL, or just the MCP base URL:

```bash
export NEXT_PUBLIC_SKAPA_FONT_STYLESHEET="http://<your-skapa-mcp-host>/fonts/noto-ikea-latin.css"
# or
export NEXT_PUBLIC_SKAPA_MCP_BASE_URL="http://<your-skapa-mcp-host>"
```

If `NEXT_PUBLIC_SKAPA_FONT_STYLESHEET` is not set, the app will automatically use:

`$NEXT_PUBLIC_SKAPA_MCP_BASE_URL/fonts/noto-ikea-latin.css`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
