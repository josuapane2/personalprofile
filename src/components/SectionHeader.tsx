export default function SectionHeader({
  label,
  title,
  description,
  align = "left",
}: {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-4 ${align === "center" ? "text-center" : ""}`}>
      {label && <p className="section-tag">{label}</p>}
      <h2 className="section-title">{title}</h2>
      {description && (
        <p
          className={`section-sub ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
