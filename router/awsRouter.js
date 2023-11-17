const awsController = require("../controller/awsController")
const router=require("express").Router();

router.post("/vpc",awsController.aws_vpc)
router.post("/pub_subnet",awsController.aws_pub_subnet)
router.post("/pvt_subnet",awsController.aws_pvt_subnet)
router.post("/internet_gateway",awsController.internet_gateway)
router.post("/route_table_pub",awsController.route_table_pub)
router.post("/pub_security_group",awsController.pub_security_group)
router.post("/pvt_security_group",awsController.pvt_security_group)
router.post("/route_table_pvt",awsController.route_table_pvt)
router.post("/pub_subnet_asso",awsController.pub_subnet_association)
router.post("/pvt_subnet_asso",awsController.pvt_subnet_association)
router.post("/ec2_instance",awsController.ec2_instance)
router.post("/login",awsController.aws_login)
router.post("/s3_bucket",awsController.s3_bucket)
router.post("/state_file",awsController.state_file)
module.exports=router