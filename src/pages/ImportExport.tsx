
import React, { useState } from "react";
import { useActivities } from "../context/ActivitiesContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ImportExport = () => {
  const { activities, addActivity, loading } = useActivities();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    // Add BOM (Byte Order Mark) to ensure Excel recognizes UTF-8
    const BOM = "\uFEFF";
    
    // Create CSV content with Arabic headers
    const headers = BOM + "اسم النشاط,المركز,مكان التنفيذ,تاريخ البدء,تاريخ الانتهاء,الحالة,الوصف,عدد المشاركين المتوقع\n";
    const csvContent = activities.reduce((acc, activity) => {
      // Clean description to avoid breaking CSV format (replace commas and newlines)
      const cleanDescription = activity.description ? activity.description.replace(/,/g, ";").replace(/\n/g, " ") : "";
      
      return (
        acc +
        `${activity.name},${activity.center},${activity.location},${activity.startDate},${activity.endDate},${
          activity.status === "preparing" ? "في مرحلة الإعداد" : 
          activity.status === "completed" ? "مكتمل" : 
          "تم تأجيل النشاط"
        },${cleanDescription},${activity.expectedParticipants || ""}\n`
      );
    }, headers);

    // Create download link and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "أنشطة_المراكز.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير البيانات بنجاح");
  };

  // استيراد البيانات من ملف CSV إلى Supabase
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("الرجاء اختيار ملف للاستيراد");
      return;
    }

    setImporting(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const csvData = e.target.result as string;
        // Handle BOM if present in the file
        const content = csvData.charCodeAt(0) === 0xFEFF ? csvData.slice(1) : csvData;
        const lines = content.split("\n");
        
        let importedCount = 0;
        let errorCount = 0;
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          // Handle quoted fields that might contain commas
          let columns = [];
          let inQuote = false;
          let currentField = "";
          
          for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            
            if (char === '"' && (j === 0 || lines[i][j-1] !== '\\')) {
              inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
              columns.push(currentField);
              currentField = "";
            } else {
              currentField += char;
            }
          }
          
          // Add the last field
          columns.push(currentField);
          
          // Make sure we have the minimum required fields
          if (columns.length >= 6) {
            try {
              // Map status from Arabic text to code values
              let status: "preparing" | "completed" | "cancelled";
              
              if (columns[5].includes("مرحلة الإعداد") || columns[5].includes("إعداد")) {
                status = "preparing";
              } else if (columns[5].includes("مكتمل") || columns[5].includes("تم")) {
                status = "completed";
              } else if (columns[5].includes("تأجيل") || columns[5].includes("ملغي")) {
                status = "cancelled";
              } else {
                status = "preparing"; // Default
              }
              
              await addActivity({
                name: columns[0],
                center: columns[1],
                location: columns[2],
                startDate: columns[3],
                endDate: columns[4],
                status: status,
                description: columns[6] || "",
                expectedParticipants: Number(columns[7]) || 1,
              });
              
              importedCount++;
            } catch (error) {
              console.error("Error importing row:", error, columns);
              errorCount++;
            }
          } else {
            errorCount++;
          }
        }
        
        if (importedCount > 0) {
          toast.success(`تم استيراد ${importedCount} نشاط بنجاح`);
        }
        
        if (errorCount > 0) {
          toast.error(`لم يتم استيراد ${errorCount} نشاط بسبب أخطاء في البيانات`);
        }
        
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
      setImporting(false);
    };
    reader.readAsText(selectedFile, "UTF-8");
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // إذا كان التطبيق في حالة تحميل البيانات، اعرض مؤشر التحميل
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-600">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">استيراد وتصدير البيانات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">استيراد الأنشطة من ملف Excel</h2>
          <p className="text-gray-600 mb-6">
            قم باستيراد قائمة الأنشطة من ملف Excel (.xlsx أو .xls) أو CSV. تأكد من أن الملف يتبع الهيكل
            المطلوب ويدعم اللغة العربية.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">اختر ملف Excel أو CSV</label>
            <input
              id="fileInput"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <h3 className="text-amber-700 font-medium mb-2">ملاحظات هامة للاستيراد:</h3>
            <ul className="space-y-2 text-sm text-amber-700 list-disc list-inside">
              <li>يجب أن يحتوي الصف الأول على العناوين بالعربية: اسم النشاط، المركز، مكان التنفيذ، تاريخ البدء، تاريخ الانتهاء، الحالة</li>
              <li>يمكن استخدام القيم التالية للحالة: "في مرحلة الإعداد"، "مكتمل"، "تم تأجيل النشاط"</li>
              <li>الوصف وعدد المشاركين اختياريان</li>
              <li>تنسيق التاريخ المقبول: DD/MM/YYYY, YYYY-MM-DD, MM/DD/YYYY</li>
              <li>تأكد من حفظ الملف بتنسيق UTF-8 لدعم اللغة العربية</li>
            </ul>
          </div>

          <Button
            onClick={handleImport}
            className="w-full bg-primary text-white"
            disabled={!selectedFile || importing}
          >
            {importing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                جاري الاستيراد...
              </>
            ) : (
              "استيراد البيانات"
            )}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">تصدير الأنشطة إلى ملف CSV</h2>
          <p className="text-gray-600 mb-6">
            قم بتصدير جميع الأنشطة الحالية في النظام إلى ملف CSV بتنسيق يدعم اللغة العربية. يمكن استخدام هذا الملف كنسخة احتياطية أو للمشاركة.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-blue-700 font-medium mb-2">خصائص ملف التصدير:</h3>
            <ul className="space-y-2 text-sm text-blue-700 list-disc list-inside">
              <li>سيحتوي الملف على جميع بيانات الأنشطة الحالية بالعربية</li>
              <li>سيتم تنسيق العناوين والبيانات باللغة العربية</li>
              <li>الملف المُصدر متوافق مع برامج Excel وGoogle Sheets</li>
              <li>يحتوي على كافة حقول النشاط بما فيها الوصف وعدد المشاركين</li>
              <li>سيتم تصدير حالات الأنشطة بالصيغة العربية (في مرحلة الإعداد، مكتمل، تم تأجيل النشاط)</li>
            </ul>
          </div>

          <Button
            onClick={handleExport}
            className="w-full bg-primary text-white"
            disabled={activities.length === 0 || exporting}
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                جاري التصدير...
              </>
            ) : (
              "تصدير جميع الأنشطة"
            )}
          </Button>
          {activities.length === 0 && (
            <p className="text-center text-gray-500 mt-2 text-sm">لا توجد أنشطة مسجلة للتصدير حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
