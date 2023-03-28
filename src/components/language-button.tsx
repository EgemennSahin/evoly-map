import Image from "next/image";

export default function LanguageButton({
  name,
  code,
}: {
  name: string;
  code: string;
}) {
  const endpoint = `https://img.icons8.com/fluency/96/null/${name}-circular.png`;

  return (
    <div className="cursor-pointer flex flex-col items-center justify-center">
      <div className="relative w-6 h-6">
        <Image src={endpoint} alt={code} fill />
      </div>
      <span className="group-hover:text-slate-600 group-first:underline group-first:text-slate-600 group-hover:underline transition-colors text-sm text-slate-300">
        {code.toUpperCase()}
      </span>
    </div>
  );
}
