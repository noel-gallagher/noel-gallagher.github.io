const BLOG_POSTS = [
  {"title": "Database isolation levels", "href": "db-isolation.html", "tags": ["TRANSACTION", "READ", "ISOLATION", "TRANSACTIONS", "BALANCE"], "searchTitle": "Database Isolation Levels"},
  {"title": "Writing a hashmap in c", "href": "c-hashmap.html", "tags": ["VALUE", "HASHMAP", "INDEX", "NEXT", "CONST"]},
  {"title": "Simple DI with python", "href": "python-config.html", "tags": ["SERVICEA", "SERVICE", "SERVICEB", "CLASS", "SERVICES"], "searchTitle": "DI in python"},
  {"title": "Opengl rendering pipeline", "href": "opengl-rendering-pipeline.html", "tags": ["VERTEX", "SHADER", "RENDERING", "FRAGMENT", "PRIMITIVES"]},
  {"title": "Approval testing", "href": "approval-testing.html", "tags": ["OUTPUT", "TESTING", "APPROVAL", "SOFTWARE", "INPUTS"]},
  {"title": "Database Replication Strategies", "href": "db-replication.html", "tags": ["REPLICATION", "LEADER", "WRITE", "DATABASE", "DIFFERENT"]},
  {"title": "Distributed computation", "href": "distributed-computation.html", "tags": ["DATA", "DISTRIBUTED", "COMPUTATION", "SPARK", "MAPREDUCE"], "searchTitle": "Brief look at some distributed computation frameworks"},
  {"title": "Akka and the actor model", "href": "akka-notes.html", "tags": ["ACTOR", "ACTORS", "MESSAGES", "MESSAGE", "AKKA"], "searchTitle": "Akka notes: walkthrough of the actor model"},
  {"title": "Concurrency Control", "href": "concurrency-control.html", "tags": ["PROCESS", "RECORD", "READ", "VERSION", "CONCURRENCY"]},
  {"title": "Concurrency", "href": "concurrency.html", "tags": ["TASK", "THREADS", "ASYNC", "TASKS", "PARALLELISM"], "searchTitle": "An Overview of Async"},
  {"title": "kafka", "href": "kafka.html", "tags": ["KAFKA", "MESSAGE", "BROKERS", "MESSAGES", "DATA"], "searchTitle": "Kafka"},
  {"title": "Sagas", "href": "saga.html", "tags": ["SERVICE", "FAILURE", "ACTION", "ORDER", "DISTRIBUTED"]},
  {"title": "Typeclasses in scala3", "href": "scala3-typeclasses.html", "tags": ["STRING", "MONOID", "SCALA", "MEMPTY", "COMBINE"], "searchTitle": "Typeclasses in scala 3"},
  {"title": "CAP Theorem", "href": "cap.html", "tags": ["SYSTEM", "PARTITION", "TOLERANCE", "CONSISTENCY", "NODES"], "searchTitle": "The Cap Theorem"},
  {"title": "some ansible notes", "href": "ansible.html", "tags": ["ANSIBLE", "PLAYBOOK", "LOCALHOST", "FILE", "STATE"], "searchTitle": "Ansible notes"},
  {"title": "Variance in scala", "href": "variance-in-scala.html", "tags": ["SUBTYPE", "CLASS", "ANIMAL", "VARIANCE", "SCALA"], "searchTitle": "Variance in Scala"},
  {"title": "From Source to Executable", "href": "compile.html", "tags": ["CODE", "SOURCE", "EXECUTABLE", "COMPILER", "BINARY"], "searchTitle": "From source to execution"},
  {"title": "Overview of Fundamentals of Data Engineering", "href": "fode.html", "tags": ["DATA", "BOOK", "BUSINESS", "STORAGE", "SYSTEMS"], "searchTitle": "Overview of Fundamentals of Data Engineering by Joe Reis and Matt Housley"},
  {"title": "Paxos", "href": "paxos.html", "tags": ["VALUE", "ACCEPTORS", "PAXOS", "PROPOSAL", "ACCEPTED"]},
  {"title": "Auto update dependencies in gitlab", "href": "gitlab-dependency-bump.html", "tags": ["REPO", "PROJECT", "DOWNSTREAM", "UPDATE", "GITLAB"], "searchTitle": "Auto updating dependencies in Gitlab"},
  {"title": "Apache Iceberg", "href": "iceberg.html", "tags": ["ICEBERG", "DATA", "LAYER", "METADATA", "FILE"]},
  {"title": "Vector clocks", "href": "vector-clocks.html", "tags": ["VECTOR", "CLOCKS", "DISTRIBUTED", "CONFLICTS", "UPDATES"], "searchTitle": "Vector Clocks"},
  {"title": "Configuring Tomcat", "href": "configuring-tomcat.html", "tags": ["CONTEXT", "NAME", "JDBC", "TOMCAT", "SERVER"], "searchTitle": "Tomcat configuration"},
  {"title": "Raft", "href": "raft.html", "tags": ["LEADER", "FOLLOWERS", "CANDIDATE", "NODE", "STATE"]},
  {"title": "What happens when you start your computer", "href": "zero-to-one.html", "tags": ["UEFI", "BIOS", "SYSTEM", "COMPUTER", "FIRST"], "searchTitle": "What happens when we start our computers?"},
  {"title": "Onion Architecture and the like", "href": "onion.html", "tags": ["DOMAIN", "LAYERS", "LAYER", "BUSINESS", "SERVICE"], "searchTitle": "Onion Architecture"},
  {"title": "Deploying a Vite App to a GitHub Pages Subdirectory", "href": "deploy-vite-github-pages.html", "tags": ["REACT", "VITE", "GITHUB", "PATH", "SUBDIRECTORY"]},
  {"title": "Consensus", "href": "consensus.html", "tags": ["CONSENSUS", "DISTRIBUTED", "SYSTEMS", "VALUE", "MUST"], "searchTitle": "Consensus - Something we can agree on"},
  {"title": "View Space", "href": "view-space.html", "tags": ["SPACE", "VIEW", "CAMERA", "VECTOR", "WORLD"], "searchTitle": "View space"},
  {"title": "Revisiting Java - Mapping with Jackson", "href": "revisiting-java-jackson.html", "tags": ["CLASS", "NAME", "USERDTO", "JAVA", "JSON"], "searchTitle": "Revisiting Java - intro to Jackson"},
  {"title": "Two-phase commit", "href": "two-phase-commit.html", "tags": ["COMMIT", "COORDINATOR", "PHASE", "EXECUTING", "DISTRIBUTED"]},
  {"title": "Database Durability", "href": "wal.html", "tags": ["TRANSACTION", "DATABASE", "DURABILITY", "CRASH", "DISK"]},
  {"title": "observability slide deck", "href": "observability.html", "tags": ["METRICS", "DATA", "THING", "REQUEST", "ABILITY"], "searchTitle": "Observability"},
  {"title": "Dockerising a Tomcat app", "href": "dockerise-tomcat.html", "tags": ["APPLICATION", "IMAGE", "TOMCAT", "NAME", "RABBITMQ"], "searchTitle": "Untitled"}
];

const search = document.querySelector('.blog-search');
const searchInput = document.getElementById('search-input');
const searchStatus = document.getElementById('search-status');
const blogGrid = document.getElementById('blog-grid');
const pagination = document.getElementById('pagination-block');
const archiveCards = Array.from(blogGrid.children);

function createResult(post) {
  const item = document.createElement('div');
  const card = document.createElement('article');
  card.className = 'card blog-card';

  const header = document.createElement('header');
  const heading = document.createElement('h2');
  const link = document.createElement('a');
  link.href = post.href;
  link.textContent = post.title;
  heading.append(link);
  header.append(heading);

  const tags = document.createElement('ul');
  tags.className = 'blog-tags';
  tags.setAttribute('aria-label', 'Topics');
  for (const tag of post.tags) {
    const tagItem = document.createElement('li');
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = tag.toLowerCase();
    tagItem.append(label);
    tags.append(tagItem);
  }

  card.append(header, tags);
  item.append(card);
  return item;
}

function updateResults() {
  const query = searchInput.value.trim().toLowerCase();
  pagination.hidden = Boolean(query);

  if (!query) {
    blogGrid.replaceChildren(...archiveCards);
    searchStatus.textContent = '';
    return;
  }

  const matches = BLOG_POSTS.filter(({ title, searchTitle, tags }) =>
    title.toLowerCase().includes(query) ||
    searchTitle?.toLowerCase().includes(query) ||
    tags.some(tag => tag.toLowerCase().includes(query))
  );
  blogGrid.replaceChildren(...matches.map(createResult));
  searchStatus.textContent = matches.length === 0
    ? 'No matching posts.'
    : `${matches.length} ${matches.length === 1 ? 'post' : 'posts'} found.`;
}

searchInput.addEventListener('input', updateResults);
for (const button of search.querySelectorAll('[data-topic]')) {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.topic;
    updateResults();
  });
}

search.hidden = false;
updateResults();
