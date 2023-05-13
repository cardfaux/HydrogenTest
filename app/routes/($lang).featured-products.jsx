import {json} from '@shopify/remix-oxygen';
import {flattenConnection} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export async function loader({context: {storefront}}) {
  return json(await getFeaturedData(storefront));
}

export async function getFeaturedData(storefront) {
  const data = await storefront.query(FEATURED_QUERY, {
    variables: {
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  data.featuredCollections.nodes.forEach((node) => {
    console.log(node);
  });
  data.featuredProducts.nodes.forEach((node) => {
    console.log(node);
  });

  invariant(data, 'No data returned from Shopify API');

  return {
    featuredCollections: flattenConnection(data.featuredCollections),
    featuredProducts: flattenConnection(data.featuredProducts),
  };
}

const FEATURED_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query homepage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT, query: "penis-pills") {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
    featuredProducts: products(first: 12, query: "penis-pills") {
      nodes {
        ...ProductCard
      }
    }
  }
`;
