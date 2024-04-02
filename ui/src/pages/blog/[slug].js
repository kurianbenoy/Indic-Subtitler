import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
import Head from "next/head";

export default function BlogPage({ content, slug }) {
  const { data, content: markdownContent } = matter(content);
  const {
    title,
    date,
    description,
    author,
    authorImg = "defaultavatar.png",
    tags = [],
    id: blogId = "",
  } = data;
  return (
    <>
      <Head>
        <title>{title} </title>
      </Head>
      <div id={blogId} className="markdown">
        <h1>{title}</h1>
        <Markdown className="mt-4">{markdownContent}</Markdown>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const blogFiles = fs.readdirSync(path.join(process.cwd(), "blogs"));
  const paths = blogFiles.map((file) => ({
    params: { slug: file.replace(/\.md$/, "") },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const markdownWithMetadata = fs.readFileSync(
    path.join(process.cwd(), "blogs", `${params.slug}.md`),
    "utf-8"
  );
  return {
    props: { content: markdownWithMetadata, slug: params.slug },
  };
}
