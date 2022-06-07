import { useRouter } from 'next/router';

export default function Project() {
  const router = useRouter();
  const { projectid } = router.query;

  return <h1>Project: {projectid}</h1>;
}
