import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useHelpStore } from '../../stores/helpStore';

interface HelpNavigationProps {
  onSelectSection: (sectionId: string) => void;
  selectedSectionId?: string;
}

const HelpNavigation: React.FC<HelpNavigationProps> = ({ onSelectSection, selectedSectionId }) => {
  const { getChildSections } = useHelpStore();
  const rootSections = getChildSections();

  const renderSection = (section: ReturnType<typeof getChildSections>[0], level = 0) => {
    const childSections = getChildSections(section.id);
    const isSelected = section.id === selectedSectionId;

    return (
      <div key={section.id} className="space-y-1">
        <button
          onClick={() => onSelectSection(section.id)}
          className={`
            w-full text-left px-4 py-2 rounded-lg text-sm
            ${isSelected
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'hover:bg-gray-50 text-gray-700'
            }
          `}
          style={{ paddingLeft: `${level * 1 + 1}rem` }}
        >
          <div className="flex items-center">
            {level > 0 && (
              <ChevronRight className="w-4 h-4 mr-1 text-gray-400" />
            )}
            <span>{section.title}</span>
          </div>
        </button>
        {childSections.length > 0 && (
          <div className="ml-4">
            {childSections.map(child => renderSection(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="space-y-1">
      {rootSections.map(section => renderSection(section))}
    </nav>
  );
};

export default HelpNavigation;