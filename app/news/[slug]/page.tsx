import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export default async function NewsPage({ params }: any) {

  const { slug } = await params;

  const filePath = path.join(
    process.cwd(),
    "content",
    "news",
    `${slug}.md`
  );

  const fileContent = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContent);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <article className="max-w-3xl mx-auto p-6 font-[Kalpurush]">

      <h1 className="text-3xl font-bold mb-4">
        {data.title}
      </h1>

      <p className="text-gray-500 mb-6">
        {data.date}
      </p>

      {data.image && (
        <img
          src={data.image}
          alt={data.title}
          className="rounded-lg mb-6"
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

    </article>
  );
}