import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-javascript";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { Toaster, toast } from "react-hot-toast";

const CodeReviewer = () => {
  const [code, setCode] = useState(` // sample code   
    const add = (a,b) => {
    return a+b;
    } 
    console.log(add(1,2));`);
  const [review, setReview] = useState("");

  const reviewCode = async () => {
    // Create a loading toast and store its ID
    const loadingToastId = toast.loading("🔍 Reviewing your code...");

    try {
      const response = await axios.post("http://localhost:4001/ai/get-review", {
        code,
      });

      setReview(
        response?.data?.response ?? "⚠️ Warning: Unexpected response format."
      );

      // Dismiss the specific loading toast by ID
      toast.dismiss(loadingToastId);
      toast.success("Review complete!");
    } catch (error) {
      console.error("Review failed:", error);

      // Dismiss the specific loading toast by ID
      toast.dismiss(loadingToastId);
      toast.error("Failed to review code.");
    }
  };

  return (
    <div className="min-h-screen w-full p-6 bg-gray-100">
      {/* The Toaster component needs to be mounted in your component */}
      <Toaster position="top-right" />

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Left Panel */}
        <div className="relative h-[calc(100vh-3rem)] rounded-2xl bg-gray-900 text-white p-6 shadow-2xl flex flex-col">
          <h1 className="text-3xl font-semibold mb-4 text-white">
            Code Reviewer
          </h1>
          <div className="h-[500px] scrollbar-none flex-grow bg-gray-800 rounded-lg shadow-inner">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                wordWrap: "on",
                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden",
                  arrowSize: 10,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
            />
          </div>
          <button
            onClick={reviewCode}
            className="cursor-pointer z-10 absolute bottom-6 right-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Review
          </button>
        </div>
        {/* Right Panel */}
        <div className="h-[calc(100vh-3rem)] rounded-2xl bg-white p-6 shadow-2xl overflow-auto flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
            AI Review Summary
          </h2>
          <div className="prose prose-sm prose-slate max-w-full break-words">
            <Markdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  return inline ? (
                    <code
                      className="bg-gray-100 text-pink-600 px-1 rounded"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-800 text-white p-4 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap">
                      <code {...props}>{children}</code>
                    </pre>
                  );
                },
              }}
            >
              {review}
            </Markdown>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeReviewer;
