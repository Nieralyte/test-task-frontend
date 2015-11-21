import {inspect as $inspect} from 'util'


export function arrToTree(arr, {id = 'id', parentId = 'parentId'} = {}) {
  const map = {}
  const tree = []
  
  arr.forEach(item => map[item[id]] = item)
  
  arr.forEach(item => {
    let parent = map[item[parentId]]
    
    if (parent)
      (parent.nodes || (parent.nodes = [])).push(item)
    else
      tree.push(item)
  })
  
  return tree
}


export function inspect(obj, depth = 10) {
  if (!Array.isArray(obj)) {
    obj = _.zipObject(_.pairs(obj).sort((a, b) => {
        a = a[0].toLowerCase()
        b = b[0].toLowerCase()
        
        return (a > b) ? 1 : ((a < b) ? -1 : 0)
      }),
    undefined)
  }
  
  return $inspect(obj, {depth})
}
