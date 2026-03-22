type Props = {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: Props) {
  return (
    <div>
      Category: {params.category}
    </div>
  );
}