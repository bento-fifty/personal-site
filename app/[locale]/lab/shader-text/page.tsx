import ShaderTextLab from '@/components/lab/ShaderTextLab'

export default async function ShaderTextLabPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params
  return <ShaderTextLab />
}
