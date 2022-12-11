import React from "react";
import { useCallback, useState, useEffect, useMemo } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ControlButton,
} from "reactflow";
import {
  SmartBezierEdge,
  SmartStepEdge,
  SmartStraightEdge,
} from "@tisoap/react-flow-smart-edge";
import "reactflow/dist/style.css";
import {
  Button,
  HeaderLayout,
  Checkbox,
  Flex,
  darkTheme,
  useTheme,
  Select,
  Option,
  Tooltip,
} from "@strapi/design-system";
import { Download, Layout } from "@strapi/icons";
import { getEntitiesRelationData } from "../../utils/requests";
import CustomNode from "../../components/CustomNode";

const HomePage = () => {
  const theme = useTheme();

  const nodeTypes = useMemo(() => ({ special: CustomNode }), []);
  const edgeTypes = useMemo(
    () => ({
      smartbezier: SmartBezierEdge,
      smartstep: SmartStepEdge,
      smartstraight: SmartStraightEdge,
    }),
    []
  );

  const [erData, setERData] = useState();
  const [error, setError] = useState();
  const [shouldSnapToGrid, setShouldSnapToGrid] = useState(false);
  const [showTypes, setShowTypes] = useState(true);
  const [showIcons, setShowIcons] = useState(true);
  const [showRelationsOnly, setShowRelationsOnly] = useState(false);
  const [edgeType, setEdgeType] = useState("smartbezier");
  const [backgroundPattern, setBackgroundPattern] = useState("dots");
  const [preventScroll, setPreventScroll] = useState(true);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const CARDS_PER_ROW = 6;

  // ========== Get Data from DB ==========
  useEffect(() => {
    async function getData() {
      try {
        setERData(await getEntitiesRelationData());
      } catch (e) {
        setError(e);
      }
    }
    getData();
  }, [setERData, setError]);

  // ========== Create Edges ==========
  useEffect(() => {
    let newEdges = [];
    if (erData) {
      erData.map((contentType) => {
        Object.keys(contentType.attributes).map((attr) => {
          if (contentType.attributes[attr].type == "relation") {
            // only add edge if target node is not excluded (not hidden)
            if (erData.some((node) => node.key === contentType.attributes[attr].target)) {
              newEdges = [
                ...newEdges,
                {
                  id: `${contentType.attributes[attr].target}-${contentType.key}.${attr}`,
                  source: contentType.key,
                  target: contentType.attributes[attr].target,
                  type: edgeType,
                  sourceHandle: attr,
                },
              ];
            }
          }
        });
      });
      setEdges(newEdges);
    }
  }, [erData]);

  // ========== Create Nodes ==========
  useEffect(() => {
    if (erData) {
      let newNodes = [];
      erData.map(
        (node, index) =>
          (newNodes = [
            ...newNodes,
            {
              id: node.key,
              position: {
                x: 8 + (index % CARDS_PER_ROW) * 280,
                y:
                  8 + ((index - (index % CARDS_PER_ROW)) / CARDS_PER_ROW) * 496,
              },
              type: "special",
              data: {
                ...node,
                showIcon: showIcons,
                showType: showTypes,
                showRelationsOnly: showRelationsOnly,
              },
            },
          ])
      );
      setNodes(newNodes);
    }
  }, [erData]);

  // ========== Apply Edge Styles ==========
  useEffect(() => {
    setEdges((theEdges) =>
      theEdges.map((edge) => {
        edge = { ...edge, type: edgeType };
        return edge;
      })
    );
  }, [setEdges, edgeType]);

  // ========== Apply Node Options ==========
  useEffect(() => {
    setNodes((theNodes) =>
      theNodes.map((node) => {
        node.data = {
          ...node.data,
          showIcon: showIcons,
          showType: showTypes,
          showRelationsOnly: showRelationsOnly,
        };
        return node;
      })
    );
  }, [setNodes, showIcons, showTypes, showRelationsOnly]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  function getBackgroundColor(variant) {
    switch (variant) {
      case "cross":
        return theme.colors.neutral200;
      case "dots":
        return darkTheme.colors.neutral300;
      case "lines":
        return theme.colors.neutral150;
      case "none":
        return theme.colors.neutral100;
    }
  }

  return (
    <>
      <HeaderLayout
        title={"Content Model Diagram"}
        subtitle={"Replace me"}
        primaryAction={<Button startIcon={<Download />}>Save Image</Button>}
      />

      <Flex padding="0 56px 8px" gap="24px">
        <Checkbox
          name="show-type-names"
          onValueChange={() => {
            setShowTypes(!showTypes);
          }}
          value={showTypes}
        >
          Type names
        </Checkbox>
        <Checkbox
          name="show-icons"
          onValueChange={() => setShowIcons(!showIcons)}
          value={showIcons}
        >
          Icons
        </Checkbox>
        <Checkbox
          name="show-relations-only"
          onValueChange={() => setShowRelationsOnly(!showRelationsOnly)}
          value={showRelationsOnly}
        >
          Only Relations
        </Checkbox>
        <Checkbox
          name="snap-to-grid"
          onValueChange={() => setShouldSnapToGrid(!shouldSnapToGrid)}
          value={shouldSnapToGrid}
        >
          Snap To Grid
        </Checkbox>

        <div style={{ flexGrow: 1 }} />

        <Select
          label="Edge Type"
          value={edgeType}
          onChange={(type) => setEdgeType(type)}
        >
          <Option value="smartbezier">Smart Bezier</Option>
          <Option value="smartstraight">Smart Straight</Option>
          <Option value="smartstep">Smart Step</Option>
          <Option value="default">Bezier</Option>
          <Option value="simplebezier">Simple Bezier</Option>
          <Option value="straight">Straight</Option>
          <Option value="step">Step</Option>
          <Option value="smoothstep">Smooth Step</Option>
        </Select>

        <Select
          label="Background"
          value={backgroundPattern}
          onChange={(pattern) => setBackgroundPattern(pattern)}
        >
          <Option value="dots">Dots</Option>
          <Option value="lines">Lines</Option>
          <Option value="cross">Cross</Option>
          <Option value="none">None</Option>
        </Select>
      </Flex>

      <div style={{ height: preventScroll ? "calc(100vh - 212px)" : "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          preventScrolling={preventScroll}
          snapGrid={[25, 25]}
          {...(shouldSnapToGrid ? { snapToGrid: true } : {})}
          fitViewOptions={{
            maxZoom: 1,
          }}
        >
          <Controls>
            <Tooltip description="Toggle Scroll Behavior">
              <ControlButton onClick={() => setPreventScroll(!preventScroll)}>
                <Layout />
              </ControlButton>
            </Tooltip>
          </Controls>
          <Background
            variant={backgroundPattern}
            color={getBackgroundColor(backgroundPattern)}
          />
        </ReactFlow>
      </div>
    </>
  );
};

export default HomePage;
