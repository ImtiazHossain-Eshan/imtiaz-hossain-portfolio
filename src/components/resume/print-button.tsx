/** Download link kept as a component for compatibility with older imports. */
export function PrintButton() {
  return (
    <a
      href="/resume/imtiaz-hossain-resume.pdf"
      download
      className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-colors duration-300 hover:bg-accent"
    >
      Download PDF
    </a>
  );
}
