import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

export default function MarkerPage({ markerId }: { markerId: string }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Sensor {markerId} - evoly</title>
        <meta name="description" content="See your sensors around the world" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col h-screen items-center pt-24">
        <div className="flex flex-col gap-4 p-8 items-center justify-start ">
          <h1 className="text-4xl">Sensor {markerId}</h1>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { markerId } = context.query;

  return {
    props: {
      markerId,
    },
  };
}
