<?php
   // get filename
   $filename = "../json/".$_POST['filename'].".json";
   // delete file
   unlink($filename);
?>