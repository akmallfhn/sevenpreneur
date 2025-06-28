import { Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import FileItemCMS from "../items/FileItemCMS";

export default function ModuleListCMS() {
  return (
    <div className="modules flex flex-col gap-3 p-3 bg-section-background rounded-md">
      <div className="section-name flex justify-between items-center">
        <h2 className="label-name font-brand font-bold">Modules</h2>
        <AppButton variant="outline" size="small">
          <Plus className="size-4" />
          Add file
        </AppButton>
      </div>
      <div className="module-list flex flex-col gap-2">
        <FileItemCMS
          fileName="Metriks OKR dalam Pemecahan Masalah"
          fileType="PPTX"
          fileIcon="https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png"
        />
        <FileItemCMS
          fileName="Modul Framework Terlengkap SBBP"
          fileType="DOCX"
          fileIcon="https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png"
        />
        <FileItemCMS
          fileName="Financial Template"
          fileType="XLSX"
          fileIcon="https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png"
        />
        <FileItemCMS
          fileName="Silabus Pembelajaran"
          fileType="PDF"
          fileIcon="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//pdf-icon.webp"
        />
      </div>
      <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
        Load more
      </p>
    </div>
  );
}
