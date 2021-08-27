export default function Post({ title, body, image }) {
    console.log(title, body, image);
    return (
        <div>
            <h1>I am a Post</h1>
        </div>
    )
}

export const getServerSideProps = async (pageContext)=> {
    const pageSlug = pageContext.query.slug;
    
    if (!pageSlug) {
        return {
            notFound: true
        }
    }
    const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
    const url = `https://iwmlzgp5.api.sanity.io/v1/data/query/production?query=${query}`;

    const result = await fetch(url).then(res => res.json());
    const post = result.result[0];

    if (!post) {
        return {
            notFound: true
        } 
    } else {
        return {
            props: {
                title: post.title,
                body: post.body,
                image: post.mainImage,
            }
        }
    }
}
