import { GetStaticProps } from 'next';
import Head from 'next/head';
import * as Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  next_page,
  results,
}: PostPagination): JSX.Element {
  return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {results.map(post => (
            <a key={post.uid} href={`/post/${post.uid}`}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div>
                <div>
                  <FiCalendar className={styles.icon} />
                  <time>{post.first_publication_date}</time>
                </div>
                <div>
                  <FiUser className={styles.icon} />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </a>
          ))}
          {next_page ? (
            <a className={styles.loadMorePosts} href={next_page}>
              Carregar mais posts
            </a>
          ) : null}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.getByType('post', {
    predicates: [Prismic.Predicates.at('document.type', 'post')],
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 100,
  });

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      results,
      next_page: postsResponse.next_page,
    },
  };
};
