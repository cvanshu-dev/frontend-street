import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategorySplitSection from "@modules/home/components/img"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { listCollections, getCollectionByHandle } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Store",
  description: "Fashion Store",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {

  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, title, handle"
  })

  // Fetch the "he" collection specifically
  const heCollection = await getCollectionByHandle("tshirt")

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <CategorySplitSection />

      {heCollection && (
        <ProductRail collection={heCollection} region={region} />
      )}

      <div className="py-1 space-y-16">

        {collections.map((collection) => (
          <section key={collection.id}>

           

            <FeaturedProducts
              collections={collections}
              region={region}
            />

          </section>
        ))}

      </div>
    </>
  )
}