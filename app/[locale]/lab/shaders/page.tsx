import ShaderLab from '@/components/lab/ShaderLab'

export default async function ShaderLabPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params
  return <ShaderLab />
}
