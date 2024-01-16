import Image from "next/image";
import Link from "next/link";
import { simplProd } from "../interface";
import { client } from "../lib/sanity";

async function getData(category: string){

    const query = `*[_type == 'clothEl' && category->name == "${category}"] {
        _id,
          "imageURL": images[0].asset->url,
            grade,
          name,
          "slug": slug.current,
          "categoryName": category->name
      }`;

      const data = await client.fetch(query);

      return data;
};

export const dynamic = "force-dynamic";

export default async function CategoryPage({params} : {params: {category: string}}) {

    const data: simplProd[] = await getData(params.category);

    const findH2 = (cat: string) => {
        switch(cat) {
            case 'top': return "Толстовки";
            case 'bot': return "Штаны";
            case 'street': return "Куртки";
            case 'footb': return "Футболки";
            default: return `Ошибки 404. Страница не найдена`;
        }
    };

    let pageH2 =  findH2(params.category);

    return (
        <div className="bg-white ">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">

          <h2 className="text-xl md:text-2xl font-bold "> Мои<span className=" text-primary ">{pageH2}</span>  </h2>

        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((clothEl) => (
            <div key={clothEl._id} className="group relative">
              <Link href={`/clothEl/${clothEl.slug}`}>
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                <Image
                  src={clothEl.imageURL}
                  alt={clothEl.name}
                  className="w-full h-full object-cover"
                  width={300}
                  height={300}
                />
              </div>
              <div className=" mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                      {clothEl.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {clothEl.categoryName}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">$ {clothEl.grade}</p>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    )

}