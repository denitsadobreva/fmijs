const fs = require("fs");

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }
}

class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  dijkstra(start, finish) {
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};
    let smallest;
    let path = [];

    Object.keys(this.adjacencyList).map(key => {
      distances[key] = key === start ? 0 : Infinity;
      key === start ? nodes.enqueue(key, 0) : nodes.enqueue(key, Infinity);
      previous[key] = null;
    });

    while (nodes.values.length) {
      smallest = nodes.dequeue().val;

      if (smallest === finish) {
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        path.push(smallest);
        path.reverse();
        break;
      }

      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbour in this.adjacencyList[smallest]) {
          let nextNode = this.adjacencyList[smallest][neighbour];
          let potentialNext = distances[smallest] + nextNode.weight;

          if (potentialNext < distances[nextNode.node]) {
            distances[nextNode.node] = potentialNext;
            previous[nextNode.node] = smallest;
            nodes.enqueue(nextNode.node, potentialNext);
          }
        }
      }
    }

    console.log(
      `The weight of the shortest path from ${start} to ${finish} is ${
        distances[path.slice(-1)[0]]
      }.`
    );
    console.log(path.join(" -> "));
  }
}

const isTextFilePath = /\.\/.+\.txt/;
const isNodeName = /^[A-Z]{1}$/;
const [, , fileName, startNode, finishNode] = process.argv;

if (
  process.argv.length !== 5 ||
  !isTextFilePath.test(fileName) ||
  !isNodeName.test(startNode) ||
  !isNodeName.test(finishNode)
) {
  console.log(
    "Invalid arguments! Expected input: node dijkstra.js <fileName> <startNode> <finishNode>"
  );
} else {
  fs.readFile(fileName, "UTF-8", (err, data) => {
    if (err) {
      throw err;
    }

    const lines = data.split("\n");
    let graph = new WeightedGraph();

    lines.map(line => {
      const [from, to, weight] = line.split(" ");
      graph.addVertex(from);
      graph.addVertex(to);
      graph.addEdge(from, to, parseInt(weight, 10));
    });

    graph.dijkstra(startNode, finishNode);
  });
}
