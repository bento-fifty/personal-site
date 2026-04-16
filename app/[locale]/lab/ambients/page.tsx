import AmbientLab from '@/components/lab/AmbientLab'

export default async function AmbientLabPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params
  return <AmbientLab />
}
