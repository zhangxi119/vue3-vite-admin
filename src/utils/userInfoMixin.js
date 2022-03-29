export default  {
  data(){
    return {
      currentUserInfo: {}
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser(){
      this.currentUserInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if(this.formData){
        this.formData.punhIssuOrgNo = this.currentUserInfo.orgId
        this.formData.punhIssuOrgName = this.currentUserInfo.orgName
      }
    }
  }
}
