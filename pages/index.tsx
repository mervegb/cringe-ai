import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import mainImage from '@/assets/images/main_image.jpg';
import { Form, Button, Spinner } from 'react-bootstrap';
import { FormEvent, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get('prompt')?.toString().trim();

    if (prompt) {
      try {
        setLoading(true);
        const response = await fetch(
          '/api/cringe?prompt=' + encodeURIComponent(prompt)
        );
        const { quote } = await response.json();
        setQuote(quote);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Cringe AI - Create cringy motivational quotes </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Cringe AI</h1>
        <h2>Powered By GPT-3.5</h2>
        <div>
          Enter a topic and AI will generate super cringy motivational quote
        </div>
        <div className={styles.mainImageContainer}>
          <Image
            src={mainImage}
            fill
            alt="A picture of a woman holding both her hands in front of her face"
            priority
            className={styles.mainImage}
          />
        </div>

        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className="mb-3" controlId="prompt-input">
            <Form.Label>Create a cringy quote about...</Form.Label>
            <Form.Control
              name="prompt"
              placeholder="e.g. success, fear, potatoes"
              maxLength={100}
            />
          </Form.Group>
          <Button type="submit" className="mb-3" disabled={loading}>
            Make me cringe
          </Button>
        </Form>
        {loading && <Spinner animation="border" />}
        {error && 'Something went wrong. Please try again.'}
        {quote && <h5>{quote}</h5>}
      </main>
    </>
  );
}
