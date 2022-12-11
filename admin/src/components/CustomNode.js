import React from "react";
import {
  Typography,
  Box,
  Divider,
  Badge,
  useTheme,
  Tooltip,
} from "@strapi/design-system";
import {
  Text,
  Email,
  RichText,
  Password,
  Number,
  Enumeration,
  Date,
  Media,
  Boolean,
  Json,
  Relation,
  UID,
  OneToMany,
  OneToOne,
  ManyToMany,
  ManyToOne,
  OneWay,
  ManyWays,
} from "@strapi/icons";
import { Handle } from "reactflow";
import styled from "styled-components";

function getIcon(attrType) {
  switch (attrType.toLowerCase()) {
    case "string":
    case "text":
      return <Text />;
    case "email":
      return <Email />;
    case "enumeration":
      return <Enumeration />;
    case "password":
      return <Password />;
    case "boolean":
      return <Boolean size="32px" />;
    case "relation":
      return <Relation />;
    case "datetime":
      return <Date />;
    case "integer":
    case "decimal":
    case "biginteger":
      return <Number />;
    case "json":
      return <Json />;
    case "uid":
      return <UID />;

    case "onetomany": //
      return <OneToMany />;
    case "oneway":
      return <OneWay />;
    case "onetoone": //
      return <OneToOne />;
    case "manytomany": //
      return <ManyToMany />;
    case "manytoone": //
      return <ManyToOne />;
    case "manyways":
    // Not sure
    case "morphtomany":
      return <ManyWays />;
  }
}

const RelationIndicator = styled.span`
  height: 20px;
  width: 20px;
  font-size: 12px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.colors.neutral0};
  position: absolute;
  right: -32px;
  top: 0;
  bottom: 0;
  margin: auto;

  svg path {
    fill: ${(props) => props.theme.colors.buttonPrimary500};
  }
`;

export default function CustomNode({ data }) {
  let attributesToShow = Object.entries(data.attributes);

  if (data.showRelationsOnly) {
    attributesToShow = attributesToShow.filter((x) => x[1].type === "relation");
  }

  const theme = useTheme();

  return (
    <Box
      background="neutral0"
      shadow="tableShadow"
      hasRadius
      padding="16px 24px"
      style={{ position: "relative" }}
    >
      <Typography
        fontWeight="bold"
        textColor="buttonPrimary500"
        padding="16px"
        className="nodrag"
        style={{ userSelect: "text", cursor: "auto" }}
      >
        {data.name}
      </Typography>
      <br />
      <Typography
        textColor="neutral400"
        padding="16px"
        className="nodrag"
        style={{ userSelect: "text", cursor: "auto" }}
      >
        {data.key}
        <Handle
          type="target"
          position="top"
          style={{
            borderColor: theme.colors.neutral200,
            background: theme.colors.neutral0,
          }}
        />
      </Typography>

      <Divider style={{ margin: "8px 0" }} />

      {attributesToShow.map((attr, index) => {
        return (
          <Typography key={attr[0]}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
                position: "relative",
              }}
            >
              <p
                style={{
                  marginRight: "auto",
                  paddingRight: "12px", //minimum gap
                  marginTop: "-2px",
                  userSelect: "text",
                  cursor: "auto",
                }}
                className="nodrag"
              >
                {attr[0]}
              </p>

              {data.showType && (
                <Badge
                  size="M"
                  backgroundColor="neutral0"
                  textColor="neutral400"
                >
                  {attr[1].type}
                </Badge>
              )}

              {data.showIcon && getIcon(attr[1].type)}
              {attr[1].type === "relation" && (
                <>
                  <Tooltip description={attr[1].relation}>
                    <RelationIndicator theme={theme}>
                      {getIcon(attr[1].relation)}
                    </RelationIndicator>
                  </Tooltip>
                  <Handle
                    type="source"
                    id={attr[0]}
                    position="right"
                    style={{
                      position: "absolute",
                      right: "-27px",
                      top: "6px",
                      bottom: "0",
                      margin: "auto",
                      visibility: "hidden",
                      position: "absolute",
                      padding: "0",
                    }}
                  />
                </>
              )}
            </div>
          </Typography>
        );
      })}
    </Box>
  );
}
