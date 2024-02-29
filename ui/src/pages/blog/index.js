import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";
import { IconArticle, IconVideo } from "@tabler/icons-react";
export const formatDate = (dateString) => {
  const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return formattedDate;
};
export const BlogCard = ({ blog }) => {
  const { frontMatter, slug } = blog;
  const {
    title,
    description,
    date,
    type = "article",
    author = "JJ Thomas",
    authorImg = "defaultavatar.png",
  } = frontMatter;

  //   const shouldHighlight = highlightableBlogs.includes(slug);
  const shouldHighlight = false;
  return (
    <div
      key={slug}
      className={`p-6 ${
        shouldHighlight
          ? "bg-blue-100 hover:bg-white"
          : "bg-white hover:bg-blue-100"
      } rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 `}
    >
      <div className="flex justify-between items-center mb-5 text-gray-500">
        <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800 gap-2">
          {type === "guide" ? (
            <>
              <IconVideo />
              <span>Guide</span>
            </>
          ) : (
            <>
              <IconArticle />
              <span>Article</span>
            </>
          )}
        </span>
        <span className="text-sm">{formatDate(date)}</span>
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
        <Link href={`/blog/${blog.slug}`}>
          <h2 className="cursor-pointer hover:underline">{title}</h2>
        </Link>
      </h2>
      <p
        className="mb-2 font-light text-gray-500 dark:text-gray-400"
        style={{ minHeight: "100px" }}
      >
        {description}
      </p>
    </div>
  );
};

export default function AllBlogs({ blogs }) {
  return (
    <section className="">
      <div className="p-8 lg:mt-5 mx-auto max-w-screen-xl lg:px-6">
        <h1 className="text-center md:text-5xl text-3xl font-medium">
          Indic Subtitler Blogs
        </h1>
        <p className="text-center mt-4 text-gray-500 md:text-lg">
          Indic-Subtitler represents an innovative open-source subtitling
          platform designed to transform the process of generating subtitles and
          transcriptions through the integration of AI technologies.
        </p>
        <div className="grid gap-8 mt-10 lg:grid-cols-2">
          {blogs.map((blog, index) => {
            return <BlogCard key={index} blog={blog} />;
          })}
        </div>
      </div>
    </section>
  );
}

export async function getStaticProps() {
  const blogFiles = fs.readdirSync(path.join(process.cwd(), "blogs"));

  const blogs = blogFiles.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(process.cwd(), "blogs", file);
    const content = fs.readFileSync(fullPath, "utf8");
    const { data: frontMatter } = matter(content);

    return {
      slug,
      frontMatter,
    };
  });

  const sortedBlogs = blogs.sort((a, b) => {
    return new Date(b.frontMatter.date) - new Date(a.frontMatter.date);
  });

  return {
    props: {
      blogs: sortedBlogs,
    },
  };
}
