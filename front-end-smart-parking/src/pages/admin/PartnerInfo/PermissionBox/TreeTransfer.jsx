import { theme, Transfer, Tree } from "antd";

// Kiểm tra xem một node có được chọn hay không
const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);

const generateTree = (treeNodes = [], checkedKeys = [], disable = false) =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key) || disable,
    children: generateTree(children, checkedKeys, true),
  }));

const TreeTransfer = ({ dataSource, targetKeys = [], ...restProps }) => {
  const { token } = theme.useToken();
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach((item) => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === "left") {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <div style={{ padding: token.paddingXS }}>
              <Tree
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={generateTree(dataSource, targetKeys)}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
              />
            </div>
          );
        }
      }}
    </Transfer>
  );
};

export default TreeTransfer;
