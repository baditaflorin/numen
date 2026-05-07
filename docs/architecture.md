# Architecture

Numen is a Mode B GitHub Pages application: static at runtime, with local data generators producing versioned artifacts.

```mermaid
C4Context
  title Numen context
  Person(researcher, "Researcher", "Writes papers and reviews literature")
  System_Boundary(pages, "GitHub Pages boundary") {
    System(numen, "Numen web app", "Static React app served from /docs")
    SystemDb(cache, "Static paper artifacts", "docs/data/v1 JSON metadata")
  }
  System_Ext(github, "GitHub repository", "Source, stars, releases")
  System_Ext(paypal, "PayPal", "Optional support link")
  Rel(researcher, numen, "Uses in browser")
  Rel(numen, cache, "Fetches")
  Rel(numen, github, "Links to")
  Rel(numen, paypal, "Links to")
```

```mermaid
flowchart TB
  subgraph "Local developer machine"
    seeds["data/seeds/papers.json"]
    generator["cmd/build-index"]
    tests["make test / make smoke"]
  end
  subgraph "Repository"
    source["src/ frontend source"]
    artifacts["docs/data/v1 artifacts"]
    pages["docs/ built Pages app"]
  end
  subgraph "Browser"
    app["Numen UI"]
    idb["IndexedDB project store"]
    lazy["Lazy engines: Mermaid, Cytoscape, DuckDB-WASM adapter"]
  end
  seeds --> generator --> artifacts
  source --> pages
  artifacts --> app
  pages --> app
  app --> idb
  app --> lazy
```

The browser owns private drafts. The repository owns public source code and generated public research metadata. There is no runtime API in v1.
