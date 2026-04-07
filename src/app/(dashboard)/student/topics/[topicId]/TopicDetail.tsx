"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { RichText } from "@/components/atoms";
import { useExamStore } from "@/store";
import Link from "next/link";

function TopicDetailSkeleton() {
  return (
    <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto max-w-4xl animate-pulse">
      {/* Back link */}
      <div className="h-4 bg-gray-200 rounded w-28 mb-6" />

      {/* Header card */}
      <div
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 5px 22px 0 rgba(0,0,0,0.04)",
        }}
        className="bg-white rounded-2xl p-6 md:p-8 mb-6"
      >
        <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-72 mb-2" />
      </div>

      {/* Content card */}
      <div
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 5px 22px 0 rgba(0,0,0,0.04)",
        }}
        className="bg-white rounded-2xl p-6 md:p-8 space-y-3"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-100 rounded"
            style={{ width: `${85 + (i % 3) * 5}%` }}
          />
        ))}
      </div>
    </section>
  );
}

export default function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const { topicDetail, isLoadingTopicDetail, fetchTopicDetail } =
    useExamStore();

  useEffect(() => {
    if (topicId) fetchTopicDetail(topicId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  if (isLoadingTopicDetail) {
    return <TopicDetailSkeleton />;
  }

  if (!topicDetail) {
    return (
      <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto">
        <p className="text-gray-400 text-center py-16">Topic not found.</p>
      </section>
    );
  }

  return (
    <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto max-w-4xl">
      {/* Back link */}
      <Link
        href="/student/topics"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <Icon icon="hugeicons:arrow-left-01" className="w-4 h-4" />
        Back to Topics
      </Link>

      {/* Header */}
      <div
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 5px 22px 0 rgba(0,0,0,0.04)",
        }}
        className="bg-white rounded-2xl p-6 md:p-8 mb-6"
      >
        {topicDetail.subjectName && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            {topicDetail.subjectName}
          </p>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {topicDetail.name}
        </h1>
      </div>

      {/* Content */}
      {topicDetail.content ? (
        <div
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.06), 0 5px 22px 0 rgba(0,0,0,0.04)",
          }}
          className="bg-white rounded-2xl p-6 md:p-8 prose prose-gray max-w-none"
        >
          <RichText content={topicDetail.content} />
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">
          No content available for this topic yet.
        </p>
      )}
    </section>
  );
}
