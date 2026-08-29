"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface TripRecommendationProps {
  content: string;
}

export default function TripRecommendation({ content }: TripRecommendationProps) {
  const components: Components = {
    // ## Day 1: ... → blue card heading
    h2: ({ children }) => (
      <h2 className="text-blue-600 font-semibold text-sm mt-0 mb-2">
        {children}
      </h2>
    ),
    // ### Morning / Afternoon / Evening
    h3: ({ children }) => (
      <h3 className="text-gray-800 font-semibold text-sm mt-3 mb-1">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-gray-700 font-semibold text-sm mt-2 mb-1">
        {children}
      </h4>
    ),
    // unordered list
    ul: ({ children }) => (
      <ul className="space-y-1 pl-0">{children}</ul>
    ),
    // list item with blue dot
    li: ({ children }) => (
      <li className="flex items-start gap-2 text-sm text-gray-700">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
    // bold
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    // paragraph
    p: ({ children }) => (
      <p className="text-sm text-gray-700">{children}</p>
    ),
  };

  // Split content into day-blocks by detecting lines starting with ## Day
  const dayBlocks = splitIntoDayBlocks(content);

  // If no day blocks detected, render as-is
  if (dayBlocks.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl p-4">
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dayBlocks.map((block, idx) => (
        <div key={idx} className="bg-blue-50 rounded-xl p-4">
          <ReactMarkdown components={components}>{block}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}

/**
 * Split markdown content into separate blocks, one per "Day" heading.
 * Supports ## Day, **Day, or plain "Day 1:" patterns at the start of a line.
 */
function splitIntoDayBlocks(content: string): string[] {
  // Normalize line endings
  const normalized = content.replace(/\r\n/g, "\n");

  // Split on lines that start a new day heading:
  // Supports: ## Day, ### Day, **Day, or "Day 1" at the start of a line
  const dayHeadingRegex = /^(?=#{1,4}\s*Day\s|\*\*Day\s|Day\s\d)/im;

  const parts = normalized.split(new RegExp(`(?=^#{1,4}\\s*Day\\s)`, "m"));

  // Filter empty parts
  const filtered = parts.map((p) => p.trim()).filter(Boolean);

  // If splitting by ## didn't work, try **Day pattern
  if (filtered.length <= 1) {
    const boldDayParts = normalized.split(/(?=^\*\*Day\s)/m);
    const boldFiltered = boldDayParts.map((p) => p.trim()).filter(Boolean);
    if (boldFiltered.length > 1) return boldFiltered;
  }

  return filtered.length > 1 ? filtered : [];
}
