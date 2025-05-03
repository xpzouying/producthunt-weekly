import rss from "@astrojs/rss";
export async function GET() {
  let allPosts = import.meta.glob("./posts/*.md", { eager: true });
  let posts = Object.values(allPosts);

  posts = posts.sort((a, b) => {
    const getPostNumber = (url) =>
      parseInt(url.split("/posts/")[1].split("-")[0]);
    return getPostNumber(b.url) - getPostNumber(a.url);
  });

  // Only 12 are kept
  posts = posts.slice(0, 12);

  // 处理 Markdown 内容，返回不过滤的标签的原始内容
  const processContent = async (item) => {
    const content = await item.compiledContent();
    return content;
  };

  return rss({
    title: "Product Hunt 日报",
    description: "Product Hunt 每日精华",
    site: "https://product-daily.haha.ai/",
    customData: `<image><url>https://gw.alicdn.com/imgextra/i2/O1CN01m9YYjS1QBeW5DOm3I_!!6000000001938-2-tps-400-400.png</url></image>`,
    items: await Promise.all(
      posts.map(async (item) => {
        const [issueNumber, issueTitle] = item.url
          .split("/posts/")[1]
          .split("-");
        const title = `第${issueNumber}期 - ${issueTitle}`;
        return {
          link: item.url,
          title,
          description: await processContent(item),
          pubDate: item.frontmatter.date,
        };
      }),
    ),
  });
}
