export default {
  methods: {
    deleteColumn(){
      const column = this.tableConfig.columns
      const idx = column.findIndex( el => el.isPermission)
      if(idx !== -1) {
        column.splice(idx, 1)
      }
    }
  }
}
