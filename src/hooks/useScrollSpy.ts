/**
 * Custom hook for scroll spy functionality using IntersectionObserver
 * Monitors which sections are in view and updates the active tab accordingly
 */
import { useEffect } from "react";

interface ScrollSpyOptions {
  rootMargin?: string;
  threshold?: number | number[];
  prefix?: string;
}

export function useScrollSpy(
  activeTab: string,
  setActiveTab: (tab: string) => void,
  tabs: Array<{ id: string; label: string }>,
  options: ScrollSpyOptions = {}
) {
  const {
    rootMargin = "-100px 0px -66% 0px",
    threshold = [0, 0.25, 0.5, 0.75, 1],
    prefix = "section-",
  } = options;

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin,
      threshold,
    };

    const intersectingSections = new Map<string, number>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id.replace(prefix, "");
        if (entry.isIntersecting) {
          intersectingSections.set(sectionId, entry.intersectionRatio);
        } else {
          intersectingSections.delete(sectionId);
        }
      });

      if (intersectingSections.size > 0) {
        let maxRatio = 0;
        let topSection = "";
        intersectingSections.forEach((ratio, sectionId) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            topSection = sectionId;
          }
        });
        if (topSection) setActiveTab(topSection);
      }
    }, observerOptions);

    tabs.forEach((tab) => {
      const element = document.getElementById(`${prefix}${tab.id}`);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      intersectingSections.clear();
    };
  }, [tabs, setActiveTab, rootMargin, threshold, prefix]);
}
