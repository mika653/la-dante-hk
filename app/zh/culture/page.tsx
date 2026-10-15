import PageHeader from "@/components/PageHeader";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import CultureEventsClient from "../../culture/CultureEventsClient";

export default function Culture() {
  return (
    <>
      <PageHeader
        eyebrow="文化"
        title="活動、工作坊、圖書館。"
        subtitle="課本以外的意大利。電影放映、aperitivi、讀書會與工作坊 — 會員及非會員均歡迎參加。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "文化" }]}
      />
      <CultureEventsClient />
      <WorkshopsGrid />
    </>
  );
}
