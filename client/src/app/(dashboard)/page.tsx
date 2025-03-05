import { Banner } from "./banner";
import { ProjectsSection } from "./projects-section";
import { TemplatesSection } from "./templates-section";

export default async function Home() {

  return (
    <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      <Banner />
      <TemplatesSection />
      <ProjectsSection />
    </div>
  );
}