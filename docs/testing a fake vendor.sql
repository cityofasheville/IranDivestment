insert into r_finance.vendors(a_vendor_id, a_vendor_name, a_vend_alpha_sort, v_dba)
values(999999,'Oil and Natural Gas Fake Test','','');

delete from r_finance.vendors where a_vendor_id = '999999';
select * from r_finance.vendors where a_vendor_id = '999999';

INSERT INTO r_finance.iran_approved_companies
(vendor_name, vendor_id)
VALUES('Oil and Natural Gas Fake Test', '999999');

delete from r_finance.iran_approved_companies where vendor_id = '999999';
select * from r_finance.iran_approved_companies where vendor_id = '999999';