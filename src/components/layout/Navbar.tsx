
import React from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onNewProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewProject }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded bg-dachpro-blue flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-dachpro-blue">
                DachPro<span className="text-dachpro-gray">+</span>
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <Button 
              onClick={onNewProject}
              className="touch-button bg-dachpro-blue hover:bg-dachpro-blue-light text-white"
            >
              Neues Projekt
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
