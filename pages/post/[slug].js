import styles from "../../styles/Post.module.css"
import imageUrlBuilder from "@sanity/image-url"
import { useState, useEffect } from "react";

export default function Post({ title, body, image }) {
    //console.log(title, body, image);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const imgBuilder = imageUrlBuilder({
            projectId: "iwmlzgp5",
            dataset: 'production',
        });
        setImageUrl(imgBuilder.image(image));
    }, [image])

    return (
        <div>
            <div className={styles.main}>
                <h1>{title}</h1>
                {imageUrl && <img className={styles.mainImage} src={imageUrl}/>}
            </div>
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
