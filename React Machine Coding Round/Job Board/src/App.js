import { useState, useEffect } from "react";

const PAGE_SIZE = 6;

const JobPosting = ({ url, by, time, title }) => {
  return (
    <div className="post" role="listitem">
      <h2 className="post__title">
        {url ? (
          <a href={url} target="_blank" rel="noopener">
            {title}
          </a>
        ) : (
          title
        )}
      </h2>
      <p className="post__metadata">
        By {by} &middot; {new Date(time * 1000).toLocaleString()}
      </p>
    </div>
  );
};
export default function App() {
  const [fetchingJobDetails, setFetchingJobDetails] = useState(false);
  const [page, setPage] = useState(0);
  const [jobIds, setJobIds] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    console.log("I am here");
    fetchJobs(page);
  }, [page]);

  const fetchJobIds = async (currPage) => {
    let jobs = jobIds;
    console.log("Jobs", jobs);
    if (!jobs) {
      const res = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      jobs = await res.json();
      setJobIds(jobs);
    }
    const start = currPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return jobs.slice(start, end);
  };

  const fetchJobs = async (currPage) => {
    const jobIdsForPage = await fetchJobIds(currPage);
    setFetchingJobDetails(true);

    const jobsForPage = await Promise.all(
      jobIdsForPage.map((jobId) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${jobId}.json`).then(
          (res) => res.json()
        )
      )
    );
    setFetchingJobDetails(false);
    const combinedJobs = [...jobs, ...jobsForPage];
    setJobs(combinedJobs);
  };
  return (
    <div className="app">
      <h1 className="title">Hacker News Jobs Board</h1>
      {jobIds == null ? (
        <p className="loading">Loading...</p>
      ) : (
        <div>
          <div className="jobs" role="list">
            {jobs.map((job) => (
              <JobPosting key={job.id} {...job} />
            ))}
          </div>
          {jobs.length > 0 && page * PAGE_SIZE + PAGE_SIZE < jobIds.length && (
            <button
              className="load-more-button"
              disabled={fetchingJobDetails}
              onClick={() => setPage(page + 1)}
            >
              {fetchingJobDetails ? "Loading..." : "Load more jobs"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
