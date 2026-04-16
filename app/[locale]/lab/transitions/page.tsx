import TransitionLab from '@/components/lab/TransitionLab'

export default async function TransitionLabPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params
  return <TransitionLab />
}
