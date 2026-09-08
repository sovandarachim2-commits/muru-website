import { SectionTitle } from '../../components/Layout';

export const AdminPlaceholder = ({ title }) => (
  <div>
    <SectionTitle title={title} subtitle={`Manage the ${title} module.`} />
    <div className="bg-white p-12 rounded-2xl border border-muru-border border-dashed text-center">
      <p className="text-muru-text-secondary">This module is ready for implementation.</p>
    </div>
  </div>
);
