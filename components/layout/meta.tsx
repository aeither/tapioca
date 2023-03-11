import Head from 'next/head'

const DOMAIN = 'https://tapioca-solutions.vercel.app/'

export default function Meta({
  title = 'Tapioca - The all-in-one restaurant management system',
  description = 'Tapioca is the solution to integrate seamless payment experience for your customers and order management for your collaborators.',
  image = `${DOMAIN}/api/og`,
}: {
  title?: string
  description?: string
  image?: string
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  )
}
