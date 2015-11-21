import * as $$ from './util.js'
import './style.less'


function checkChildren(node, treeview) {
  if (node.nodes) {
    node.nodes.forEach(node => {
      treeview.checkNode(node.nodeId, {silent: true})
      checkChildren(node, treeview)
    })
  }
}

function uncheckChildren(node, treeview) {
  if (node.nodes) {
    node.nodes.forEach(node => {
      treeview.uncheckNode(node.nodeId, {silent: true})
      uncheckChildren(node, treeview)
    })
  }
}

function buildTreeview(data) {
  return $('#myTreeview').treeview({
    data: data,
    showCheckbox: true,
    
    onNodeChecked(evt, node) {
      checkChildren(node, treeview)
    },
    
    onNodeUnchecked(evt, node) {
      uncheckChildren(node, treeview)
    },
  }).treeview(true) // get an instance
}


let treeview

$.ajax({
    url: '/colls',
    method: 'GET',
    dataType: 'json', // response data type
})
  .then(({colls, collGroups}) => {
    return Promise.all(colls.map(coll => {
      return $.ajax({
          url: coll.server,
          method: 'GET',
          dataType: 'json',
      })
        .then(({objects, objectGroups}) => {
          objectGroups.forEach(objGroup =>
            (coll.nodes || (coll.nodes = [])).push(objGroup)
          )
          
          objects.forEach(obj => {
            let parent = _.find({id: obj.groupId}, objectGroups)
            
            if (parent)
              (parent.nodes || (parent.nodes = [])).push(obj)
          })
        })
    }))
      .then(() => {
        colls.forEach(coll => {
          let parent = _.find({id: coll.groupId}, collGroups)
          
          if (parent)
            (parent.nodes || (parent.nodes = [])).push(coll)
        })
        
        treeview = buildTreeview($$.arrToTree(collGroups))
      })
  })
  
  .fail((...args) => console.log('failed', args))
