
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) => {
  return (
    <div className="flex items-center gap-3 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground w-32">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
  )
}

export default InfoRow