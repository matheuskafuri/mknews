import { GetStaticPaths, GetStaticProps } from 'next';

import * as prismicH from '@prismicio/helpers';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { getPrismicClient, linkResolver } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  function readingTime(): number {
    const wordsHeading = post.data.content.map(
      ({ heading }) => heading.split(' ').length
    );
    const wordsBody = post.data.content.map(({ body }) =>
      body.reduce((acc, { text }) => acc + text.split(' ').length, 0)
    );
    const words = wordsHeading.concat(wordsBody);
    const numberOfWords = words.reduce((acc, curr) => acc + curr, 0);
    const minutes = Math.ceil(numberOfWords / 200);
    return minutes;
  }
  const readingTimeResult = readingTime();

  return (
    <main className={commonStyles.container}>
      <article className={styles.post}>
        <img
          src={post.data.banner.url}
          alt={post.data.title}
          className={styles.banner}
        />
        <div className={styles.postAlignment}>
          <div className={styles.postContent}>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <div>
                <FiCalendar className={styles.icon} />
                <time>{post.first_publication_date}</time>
              </div>
              <div>
                <FiUser className={styles.icon} />
                <span>{post.data.author}</span>
              </div>
              <div>
                <FiClock className={styles.icon} />
                <span>{readingTimeResult} min</span>
              </div>
            </div>
            <div className={styles.postTemplate}>
              {post.data.content.map(({ heading, body }) => (
                <div key={heading}>
                  <h2>{heading}</h2>
                  {body.map(({ text }) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.getAllByType('post');

  return {
    paths: posts.map(post => prismicH.asLink(post, linkResolver)),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;
  const response = await prismic.getByUID('post', `${slug}`);

  console.log(response.data.content[1].body[0]);

  const responseFormatted = {
    first_publication_date: new Date(
      response.first_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(({ heading, body }) => ({
        heading,
        body: body.map(({ text }) => ({
          text,
        })),
      })),
    },
  };

  return {
    props: {
      post: responseFormatted,
    },
  };
};
