create user splitpay_user identified by splitpay123;

grant connect, resource to splitpay_user;
grant unlimited TABLESPACE TO splitpay_user;
